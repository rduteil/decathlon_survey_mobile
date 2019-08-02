import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native';

import { COLOR_PALETTE } from '../../config/theme';

const styles = StyleSheet.create({
    clickableArea: {
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    circle: {
        width: 24, 
        height: 24, 
        borderWidth: 2, 
        borderColor: COLOR_PALETTE.primaryColor.P500, 
        borderStyle: 'solid',
        borderRadius: 13,
        margin: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    checked: {
        width: 16, 
        height: 16, 
        backgroundColor: COLOR_PALETTE.primaryColor.P500,
        borderRadius: 8,
    },
});

class FuckinRadioButton extends Component {
    render(){
        if(this.props.checked){
            return(
                <TouchableWithoutFeedback
                    style={styles.clickableArea}
                    onPress={() => this.props.onChange(true, this.props.line, this.props.column)}
                    underlayColor={COLOR_PALETTE.primaryColor.P300}
                >
                    <View style={styles.circle}>
                        <View style={styles.checked}/>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else {
            return(
                <TouchableWithoutFeedback
                    style={styles.clickableArea}
                    onPress={() => this.props.onChange(true, this.props.line, this.props.column)}
                    underlayColor={COLOR_PALETTE.primaryColor.P300}
                >
                    <View style={styles.circle}/>
                </TouchableWithoutFeedback>            
            );
        }
    }
} export default FuckinRadioButton;