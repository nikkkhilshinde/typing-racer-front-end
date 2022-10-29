import React from 'react';

import {Stomp} from '@stomp/stompjs';
import {v4 as uuidv4} from 'uuid';

class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.isWebsocketConnectionActive = false;
        this.state = {
            isWebsocketConnectionActive: false,
            content: ['Text', 'will', 'appear', 'here', 'shortly'],
            progress: 0,
            currentWord: '',
            wordRef: []
        };
    }

    handleErrorMessages(message) {

    }

    handleEventMessages(event) {
        const message = JSON.parse(event.body);
        // eslint-disable-next-line default-case
        console.log(message)
        switch (message.messageType) {
            case 'CONTENT':
                this.setState({content: message.data.content}, () => {
                    for (let i = 0; i < this.state.content.length; i++) {
                        this.state.wordRef.push(React.createRef())
                    }
                });
                // console.log("Content received: ", this.state);
                break;

            case 'STATUS':
                console.log("Status received: ", message.data.status);
                this.setState({progress: message.data.status}, () => {
                    this.setState({
                        currentWord: this.state.content[this.state.progress].word,
                    }, () => {
                        console.log("this state ", this.state.currentWord)
                    })

                });
                break;

            default:
                console.log("default")
        }
    }

    componentDidMount() {
        try {
            const stompClient = Stomp.client("ws://localhost:10802/game");
            stompClient.connect({}, () => {
                this.isWebsocketConnectionActive = true;
                stompClient.subscribe("/user/topic/errors", (message) => {
                    this.handleErrorMessages(message);
                }, [])
                stompClient.subscribe("/user/topic/events", (message) => {
                    this.handleEventMessages(message);
                }, [])
                stompClient.send("/app/game", {},
                    JSON.stringify({"messageType": 'REGISTER'})
                )
            })

        } catch (error) {
            console.error("Error ", error)
        }
    }

    handleChange(event) {
        const keyPressed = event.nativeEvent.data;
        const matchingValue = this.state.currentWord;
        const currentValue = event.target.value;

        if (currentValue === '') {
            this.state.wordRef[this.state.progress].current.classList = []
        }

        for (let i = 0; i < Math.min(matchingValue.length, currentValue.length); i++) {
            if (matchingValue[i] !== currentValue[i]) {
                this.state.wordRef[this.state.progress].current.classList.add("red")
            } else {
                this.state.wordRef[this.state.progress].current.classList.add("green")
            }
        }

        if (keyPressed === ' ') {
            event.target.value = '';

        }
    }

    render() {
        return <>
            <div className="App">
                <h1>Type Racer Clone</h1>
                <div className="TextContainer">
                    {
                        this.state.content.map((item) => (
                            <span className={this.state.progress === item.id ? 'highlight' : ''} key={uuidv4()}
                                  id={item.id} ref={this.state.wordRef[item.id]}>{item.word} </span>
                        ))
                    }
                </div>
                <div className="InputContainer" value={this.state.inputValue} onChange={this.handleChange.bind(this)}>
                    <textarea/></div>
            </div>
        </>
    }
}

export default Homepage;