import React from 'react';
import './App.css';
import WebsocketHandler from './websocket/websocketHandler'
import Button from '@mui/material/Button';
import Popup from './components/popup';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import CardsContainer from './components/cardsContainer';

class App extends React.Component {

    state = {
        groups: {},
        open: false,
        cards: [],
        nameToEdit: '',
        popup: {
            selectedGroups: new Set(),
            groupName: ""
        }
    }

    darkTheme = createTheme({
        palette: {
        mode: 'dark'
        }
    })

    socket

    callback = (msg) => {
        msg = JSON.parse(msg.data)
        const result = {}
        for(let key in msg) {
        result[key] = JSON.parse(msg[key])
        }
        this.setState({
        groups: result
        })
    }

    componentDidMount = () => {
        if(!this.socket) {
            this.socket = new WebsocketHandler(this.callback);
        }
        
        try {
            let cards = JSON.parse(document.cookie)
            for(let key in cards) {
                let set = new Set()
                for(let group in cards[key].groups) {
                    set.add(cards[key].groups[group])
                }
                cards[key].groups = set
            }
            this.setState({cards: cards})
        } catch(ignore) {
            
        }
    }

    handleClickOpen = () => {
        this.setState({open: true, popup: {
            selectedGroups: new Set(),
            groupName: ""
        }});
    }

    handleClose = () => {
        this.setState({open: false, popup: {
            selectedGroups: new Set(),
            groupName: ""
        }})
    }

    handleSave = () => {
        this.handleClose()
        const data = this.state.popup
        const cards = this.state.cards
        let nameMatch = this.state.nameToEdit ? this.state.nameToEdit : data.groupName;  
        let card = cards.find(card => card.groupName === nameMatch);
        if(card) {
            card.groupName = data.groupName;
            card.groups = data.selectedGroups;
        } else {
            cards.push({
                groupName: data.groupName,
                groups: data.selectedGroups
            });
        }
        this.setState({cards: cards, popup: {
            selectedGroups: new Set(),
            groupName: ""
        },
        nameToEdit: ''})
        let cookieObject = JSON.parse(JSON.stringify(cards))
        for(let card in cookieObject) {
            cookieObject[card].groups = [...cards[card].groups]
        }
        document.cookie = JSON.stringify(cookieObject)
    }

    handleEdit = (name) => {
        const cards = this.state.cards
        const startSettings = cards.find(card => card.groupName === name);
        this.setState({
            popup: {
                selectedGroups: startSettings.groups,
                groupName: startSettings.groupName
            },
            open: true,
            nameToEdit: name
        })
    }

    handlePopupChange = (obj) => {
        this.setState({popup: obj})
    }

    handleDelete = (name) => {
        let newCards = this.state.cards.filter(card => card.groupName !== name);
        this.setState({cards: newCards});
        document.cookie = JSON.stringify(newCards)
    }

    render() {
        const {groups, open, cards, popup} = this.state;
        
        return (
            <ThemeProvider theme={this.darkTheme}>
                <div className="App">
                    <div className="App-header">
                        <div style={{ width: '90%'}} >
                            <CardsContainer handleEdit={this.handleEdit} handleDelete={this.handleDelete} data={groups} cards={cards}  />
                        </div>
                        <Button style={{margin: 100}} size="large" variant="contained" onClick={this.handleClickOpen}>        
                            Add Supergroup
                        </Button>
                        <Popup values={popup} data={groups} open={open} handlePopupChange={this.handlePopupChange} handleSave={this.handleSave} handleClose={this.handleClose} />
                    </div>
                </div>
            </ThemeProvider>
        
        );
    }
}

export default App;
