import React, { Component } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';

import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import styles from '../../../imports/styles/ModalStyle';

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

class DownloadDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            link: '',
        };
    }
    
    render = () => {
        return(
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.toggleDownloadDialogVisibility(false)}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {'Télécharger un questionnaire'}
                    </Text>
                    <View style={styles.modalBody}>
                        <Text>
                            {'Entrez le lien du questionnaire'}
                        </Text>
                        <TextInput
                            onChangeText={(e) => this.setState({link: e})}
                        />
                    </View>
                    <View style={styles.modalFooter}>
                        <ApolloConsumer>
                            {client => (
                                <TouchableWithoutFeedback 
                                    onPress={() => {
                                        const {data} = client.query({
                                            query: FindSurveyFromLink,
                                            variables: {link: this.state.link}
                                        }).then(
                                            (response) => this.props.writeSurvey(response.data.surveyFromLink),
                                            (error) => this.props.handleError(error, this.state.link)
                                        );
                                    }}
                                >
                                    <View>
                                        <Text style={styles.modalFooterText}>
                                            {'TELECHARGER'}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )}
                        </ApolloConsumer>
                        <TouchableWithoutFeedback onPress={() => this.props.toggleDownloadDialogVisibility(false)}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'ANNULER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
          </Modal>
        );
    };

} export default DownloadDialog;