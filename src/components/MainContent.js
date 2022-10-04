import React from 'react';

import {Stomp} from '@stomp/stompjs';
import {v4 as uuidv4} from 'uuid';

class MainContent extends React.Component {


    constructor(props) {
        super(props);
        this.stompClient = Stomp.client("ws://localhost:10802/game");
        this.gameId = "";

    }

    componentDidMount() {
        fetch('http://localhost:10802/v1/game?requestId=' + uuidv4())
            .then((response) => response.json())
            .then((data) => {
                console.log("Received Game ID : ", data.data.gameId);
                this.gameId = data.data.gameId;
                this.stompClient.connect({}, () => {
                })
                this.stompClient.send("/app/game", {},
                    JSON.stringify({"messageType": 'REGISTER', "gameId": this.gameId})
                )
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    handleChange(event) {

        if (event.nativeEvent.inputType === "deleteContentBackward") {
            console.log("back-press")
        } else {
            const keyPressed = event.nativeEvent.data;
            console.log(keyPressed)

            if (keyPressed === ' ') {
                event.target.value = '';
            }
        }

    }

    render() {
        return <>
            <div className="App">
                <h1>Type Racer Clone</h1>
                <div className="TextContainer">Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                    printer
                    took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </div>
                <div className="InputContainer" onChange={this.handleChange}><textarea/></div>
            </div>
        </>
    }
}


export default MainContent;