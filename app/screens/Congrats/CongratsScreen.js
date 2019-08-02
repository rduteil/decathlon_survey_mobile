import React, { Component } from 'react';
import { View, Button, Text, BackHandler } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';

import Toast from 'react-native-easy-toast';

import styles from './styles/CongratsScreenStyle';
import { COLOR_PALETTE } from '../../config/theme.js';

class CongratsScreen extends Component {
    constructor(props){
        super(props);
    };

    componentDidMount = () => {
        this.refs.toast.show(this.props.navigation.getParam(`message`), 2000);
        BackHandler.addEventListener(`hardwareBackPress`, this.handleBackButtonClick);
    };

    componentWillUnmount = () => {
        BackHandler.removeEventListener(`hardwareBackPress`, this.handleBackButtonClick);
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = ({navigation}) => ({
        title: 'Fin du questionnaire',
        headerLeft: null,
    });

    handleBackButtonClick = (event) => {
        this.props.navigation.goBack(this.props.navigation.getParam('key'));
        return true;
    };

    render = () => {
        return(
            <View>
                <Text style={styles.title}>
                    {`Merci d'avoir répondu à ce questionnaire. Pour retourner au menu principal, cliquez sur le bouton : `}
                </Text>
                <View style={styles.buttonsWrapper}>
                    <Button
                        color={COLOR_PALETTE.primaryColor.P500}
                        title={`Retourner au menu principal`}
                        onPress={() => this.props.navigation.goBack(this.props.navigation.getParam('key'))}
                    />
                </View>
                <Toast 
                    ref={`toast`}
                    position={`bottom`}
                    positionValue={150}
                    style={styles.toastContainer}
                    textStyle={styles.toastText}
                />
            </View>
        );
    };
} export default CongratsScreen;