import React, { Component } from 'react';
import { View, Text, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';

import styles from '../../../imports/styles/ModalStyle';

class ActivationKeyDialog extends Component {
    constructor(props){
        super(props);

        this.state = {
            activationKey: '',
        };
    }
    render = () => {
        return(
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.togglePasswordDialogVisibility(false)}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {'Questionnaire inactif'}
                    </Text>
                    <View style={styles.modalBody}>
                        <Text>
                            {'Entrez le mot de passe du questionnaire'}
                        </Text>
                        <TextInput
                            onChangeText={(event) => this.setState({activationKey: event})}
                        />
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableWithoutFeedback onPress={() => this.props.checkActivationKey(this.state.activationKey)}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'ACCEDER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.toggleActivationKeyDialogVisibility(false)}>
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
    }
} export default ActivationKeyDialog;