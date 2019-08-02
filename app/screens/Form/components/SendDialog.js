import React, { Component } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native';

import styles from '../../../imports/styles/ModalStyle';

class SendDialog extends Component {
    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.hideSendDialog()}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {'Envoi de la réponse'}
                    </Text>
                    <View style={styles.modalBody}>
                        <Text>
                            {'Voulez vous vraiment envoyer la réponse ?'}
                        </Text>
                    </View>
                    <View style={styles.modalFooter}>
                        <TouchableWithoutFeedback onPress={() => this.props.onConfirm()}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'OUI'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.props.hideSendDialog()}>
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
} export default SendDialog;