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
    square: {
        width: 24, 
        height: 24, 
        borderWidth: 2, 
        borderColor: COLOR_PALETTE.primaryColor.P500, 
        borderStyle: 'solid',
        borderRadius: 2,
    },
    checked: {
        backgroundColor: COLOR_PALETTE.primaryColor.P500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: COLOR_PALETTE.primaryColor.P300,
    },
});

class FuckinCheckbox extends Component {
    render(){
        if(this.props.checked){
            return(
                <TouchableWithoutFeedback
                    style={styles.clickableArea}
                    onPress={() => this.props.onChange(false, this.props.line, this.props.column)}
                >
                    <View 
                        style={[styles.square, styles.checked]}
                    >
                        <Text style={styles.text}>
                            {'✓'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else {
            return(
                <TouchableWithoutFeedback
                    style={styles.clickableArea}
                    onPress={() => this.props.onChange(false, this.props.line, this.props.column)}
                >
                    <View style={styles.square}/>
                </TouchableWithoutFeedback>            
            );
        }
    }
} export default FuckinCheckbox;