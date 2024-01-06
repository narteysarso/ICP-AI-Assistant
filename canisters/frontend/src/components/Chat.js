import React, { useContext, useEffect, useRef } from "react";
import { } from 'react-time-ago';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
} from "mdb-react-ui-kit";
import MessageCard from "./MessageCard";
import { WSContext } from "../context/useWS";
import MessageForm from "./MessageForm";

export default function Chat() {
    const { isConnected, messages, emit, threadId } = useContext(WSContext);
    const ref = useRef(null);

    const sendMessage = (value, callback = () => { }) => {
        // console.log(callback);
        emit("message", { message: value, thread_id: threadId }, callback);
    }

    const scrollToLastMessage = () => {
        const lastChildElement = ref.current?.lastElementChild;
        lastChildElement?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isConnected) {
            scrollToLastMessage();
        }
    }, [isConnected, messages]);


    return (
        <MDBContainer className="" fluid style={{ backgroundColor: "#CDC4F9", height: "100vh" }}>
            <MDBRow className="py-5 px-3 justify-content-center mb-3" style={{ overflowY: "scroll" }}>
                <MDBCol ref={ref} md="8" style={{ height: "75vh" }}>

                    {
                        messages?.map((msg, idx) => <MessageCard {...msg} key={idx} />)
                    }

                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol sm="12">
                    <MessageForm submit={sendMessage} />
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}