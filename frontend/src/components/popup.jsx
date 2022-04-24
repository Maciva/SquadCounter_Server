import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import React from 'react';

class Popup extends React.Component {

    buildItems = (data) => {
        const result = []
        const {values, handlePopupChange} = this.props
        const selectedGroups = values.selectedGroups;
        for(let key in data) {
            const group = data[key];
            const selected = selectedGroups.has(group.group)
            result.push(
                <ListItemButton
                    selected={selected}
                    onClick={() => {
                        if(selectedGroups.has(group.group)) {
                            selectedGroups.delete(group.group)
                        } else {
                            selectedGroups.add(group.group)
                        }
                        let old = values;
                        old.selectedGroups = selectedGroups
                        handlePopupChange(old)
                    }}
                >
                    <Checkbox
                        edge="start"
                        checked={selected}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': 2 }}
                    />
                    <ListItemText primary={group.group} />
                </ListItemButton>
            );
        }
        if(result.length === 0) {
            result.push(
                <ListItemButton>
                    <ListItemText primary={"No Groups registered"} />
                </ListItemButton>
            )
        }
        return result;
    }

    handleCancel = () => {
        this.props.handleClose();
    }

    handleSave = () => {
        this.props.handleSave()
    }

    handleTextFieldChange = (e) => {
        let old = this.props.values;
        old.groupName = e.target.value
        this.props.handlePopupChange(old);
    }

    render() {
        const {open, handleClose, data, values} = this.props;
        const listItems = this.buildItems(data);
        return (<Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {"Add Supergroup"}
            </DialogTitle>
            <DialogContent sx={{padding: 0}}>
                <TextField
                    sx={{
                        margin: 2
                    }}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Supergroup Name"
                    variant="standard"
                    onChange={this.handleTextFieldChange}
                    value={values.groupName}
                />
                <List component="nav" sx={{padding: 0, width: 300, bgcolor: 'background.paper' }}>
                        {listItems}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCancel}>Cancel</Button>
                <Button onClick={this.handleSave} disabled={values.selectedGroups.size === 0 || values.groupName === ''} >
                    Save
                </Button>
            </DialogActions>

        </Dialog>)
    }

}

export default Popup