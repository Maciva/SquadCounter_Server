import { Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

class CardsContainer extends React.Component {

    buildCards = (cards, data) => {
        const result = [];
        for(let card in cards) {
            result.push(this.buildCard(cards[card], data))
        }
        return result;
    }

    buildCard = (card, data) => {
        const {handleEdit, handleDelete} = this.props
        let alive = 0;
        Object.values(data).filter(element => card.groups.has(element.group)).forEach(e => alive += e.alive)
        let total = card.groups.size * 5
        let alivePercentage = alive / total;
        let hex = ''
        if (alivePercentage > 0.5) {
            let red = Math.round((1 - alivePercentage) * 2 * 255)
            let green = 255
            hex = rgbToHex(red, green, 0)
        } else {
            let red = 255
            let green = Math.round(alivePercentage * 2 * 255)
            hex = rgbToHex(red, green, 0)
        }

        return (
            
              <Grid item xs={4}>
                <Card>
                    <CardHeader
                        title={card.groupName}
                    />

                    <CardContent>
                        <Typography style={{color: hex}} variant='h2'>
                            {alive + "/" + total}
                        </Typography>
                    </CardContent>
                    <CardActions style={{
                        justifyContent: 'center'
                    }} >

                    <IconButton onClick={() => handleEdit(card.groupName)} >
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={() => handleDelete(card.groupName)} >
                        <DeleteIcon/>
                    </IconButton>
                        
                    </CardActions>
                </Card>
            </Grid>  
            
        )
    }

    render() {
        const {cards, data} = this.props
        return (
            <React.Fragment>
               <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={8}>
                {this.buildCards(cards, data)}
            </Grid> 
            </React.Fragment>
            
        )
    }
}

export default CardsContainer