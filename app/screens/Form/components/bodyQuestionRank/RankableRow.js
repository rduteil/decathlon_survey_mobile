import React, { Component } from 'react';
import { Animated, Easing, StyleSheet, Text, Image, View, Dimensions, Platform } from 'react-native';
import SortableList from 'react-native-sortable-list';

import { COLOR_PALETTE } from '../../../../config/theme';

class RankableRow extends Component {
    constructor(props) {
        super(props);
    
        this._active = new Animated.Value(0);
    
        this._style = {
          ...Platform.select({
            ios: {
              transform: [{
                scale: this._active.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              }],
              shadowRadius: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 10],
              }),
            },
    
            android: {
              transform: [{
                scale: this._active.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              }],
              elevation: this._active.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 6],
              }),
            },
          })
        };
      }
    
      componentWillReceiveProps(nextProps) {
        if (this.props.active !== nextProps.active) {
          Animated.timing(this._active, {
            duration: 150,
            easing: Easing.bounce,
            toValue: Number(nextProps.active),
          }).start();
        }
      }
    
      render() {
       const {data, active} = this.props;
    
        return (
          <Animated.View 
            style={[styles.row, this._style,]}
          >
            <Image source={{uri: data.image}} style={styles.image}/>
            <Text style={styles.text}>{data.label}</Text>
          </Animated.View>
        );
    }
} export default RankableRow;

const styles = StyleSheet.create({
    row: {
      display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR_PALETTE.gray,
        paddingVertical: 2,
        paddingHorizontal: 5,
        marginVertical: 2,
        marginHorizontal: 20,
        borderRadius: 2,
  	},
  	image: {
    	  width: 100,
    	  height: 100,
    	  marginLeft: 10,
		    borderRadius: 2,
		    resizeMode: 'contain',
  	},
  	text: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
  	},
});