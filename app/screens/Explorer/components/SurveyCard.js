import React, { Component } from 'react';
import { Image, View, Text, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-swipeable';

import moment from 'moment';
require('moment/locale/fr');

import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import styles from '../styles/SurveyCardStyle';
import { COLOR_PALETTE } from '../../../config/theme';

const FindSurveyFromLink = gql`query FindSurveyFromLink($link: String!){
	surveyFromLink(link: $link){
		id
		name
		link
		reference
		image
		description
		hangout
		activationDate
		deactivationDate
        activationKey
        language
		lastUpdate
		sections {
			id
			name
			index
			image
			description
			hangout
			questions {
				id
				name
				index
				description
				hangout
				mandatory
				type
				askFor
				linesNumber
				columnsNumber
				linesLabels
				columnsLabels
				linesImages
				columnsImages
				numberOfAnswers
				valuesAsImages
				numberOfValues
                values
                topLabel
                bottomLabel
				fileTypes
				commentary
				scaleMin
				scaleMax
				step
				labelsValues
				selectedValue
				graduation
				gradient
				gradientType
				dateInterval
				dateMin
				dateMax
			}
		}
		questions {
			id
			name
			index
			description
			hangout
			mandatory
			type
			askFor
			linesNumber
			columnsNumber
			linesLabels
			columnsLabels
			linesImages
			columnsImages
			numberOfAnswers
			valuesAsImages
			numberOfValues
            values
            topLabel
            bottomLabel
			fileTypes
			commentary
			scaleMin
			scaleMax
			step
			labelsValues
			selectedValue
			graduation
			gradient
			gradientType
			dateInterval
			dateMin
			dateMax
		}
	}
}`;

class SurveyCard extends Component {
    render = () => {
        let rightButtons = [
            <ApolloConsumer>
                {(client) => (
                    <View style={styles.swipeButtonContainer}>
                        <TouchableHighlight 
                            style={styles.swipeButton}
                            overlayColor={COLOR_PALETTE.secondaryColor.A400}
                            onPress={() => {
                                const {data} = client.query({
                                    query: FindSurveyFromLink,
                                    variables: {link: this.props.survey.link}
                                }).then(
                                    (response) => this.props.writeSurvey(response.data.surveyFromLink),
                                    (error) => this.props.handleError(error, this.props.survey.link)
                                );
                            }}
                        >
                            <Icon name='reload' size={25} color={COLOR_PALETTE.white}/>
                        </TouchableHighlight>
                    </View>
                )}
            </ApolloConsumer>,
            <View style={styles.swipeButtonContainer}>
                <TouchableHighlight style={styles.swipeButton} overlayColor={COLOR_PALETTE.secondaryColor.A400} onPress={() => this.props.deleteSurvey(this.props.survey.id)}>
                    <Icon name='delete' size={25} color={COLOR_PALETTE.white}/>
                </TouchableHighlight>
            </View>,
        ];

        let activeOrNot = '';
        let isActive = true;
        let deactivationDate = moment.utc(this.props.survey.deactivationDate, 'DD-MM-YYYY HH:mm');
        let activationDate = moment.utc(this.props.survey.activationDate, 'DD-MM-YYYY HH:mm');
        if(this.props.survey.activationDate === 'Activé'){
            if(this.props.survey.deactivationDate === 'Aucune'){
                activeOrNot = 'Questionnaire actif';
            }
            else if(moment().isBefore(deactivationDate)){
                activeOrNot = `Questionnaire actif jusqu'au ${this.props.survey.deactivationDate}`;
            }
            else {
                activeOrNot = `Questionnaire inactif depuis le ${this.props.survey.deactivationDate}`;
                isActive = false;
            }
        } 
        else {
            if(moment().isBefore(activationDate)){
                activeOrNot = `Questionnaire actif à partir du ${this.props.survey.activationDate}`;
                isActive = false;
            }
            else if (this.props.survey.deactivationDate === 'Aucune'){
                activeOrNot = 'Questionnaire actif';
            }
            else if(moment().isBefore(deactivationDate)){
                activeOrNot = `Questionnaire actif jusqu'au ${this.props.survey.deactivationDate}`;
            }
            else {
                activeOrNot = `Questionnaire inactif depuis le ${this.props.survey.deactivationDate}`;
                isActive = false;
            }
        }

        return (
            <Swipeable
                style={styles.mainContainer}
                rightButtons={rightButtons}
                rightButtonWidth={90}
            >
                <TouchableWithoutFeedback onPress={() => this.props.navigateToForm(this.props.survey, isActive)}>
                    <View style={styles.wrapperInColumn}>
                        <View style={styles.wrapperInRow}>
                            {this.props.survey.image === '' ? null: 
                                <View style={styles.imageContainer}>
                                    <Image style={styles.image} source={{uri: this.props.survey.image}} resizeMode='contain'/>
                                </View>
                            }
                            <View style={styles.textWrapper}>
                                <Text style={styles.name} numberOfLines={2}>{this.props.survey.name}</Text>
                                <Text numberOfLines={3}>{this.props.survey.description}</Text>
                            </View>
                            <View style={[styles.triangleShape, {backgroundColor: this.props.survey.hangout ? COLOR_PALETTE.secondaryColor.A400: COLOR_PALETTE.primaryColor.A400}]}/>
                        </View>
                        <View style={styles.textWrapper}>
                            <Text style={[styles.italicText, {color: isActive ? COLOR_PALETTE.primaryColor.A400: COLOR_PALETTE.secondaryColor.A400}]} numberOfLines={1}>{activeOrNot}</Text>
                            <Text style={styles.italicText}>
                                {`${this.props.survey.stockedAnswers} réponse(s) en attente d'envoi / ${this.props.survey.sentAnswers} réponse(s) envoyée(s)`}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        );
    }
} export default SurveyCard;