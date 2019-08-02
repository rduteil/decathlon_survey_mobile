import React, { Component } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TextInput } from 'react-native';

import FuckinCheckbox from '../../../imports/components/FuckinCheckbox';
import FuckinRadioButton from '../../../imports/components/FuckinRadioButton';
import styles from '../../../imports/styles/ModalStyle';

class SortDialog extends Component {
    onChangeButton = (isRadioButton, line, column) => {
        if(line === 1){
            this.props.setSort(this.props.sort.by, (this.props.sort.reversed === -1 ? 1: -1));
            return;
        }
        let value = 'name';
        switch(column){
            case 0:
                break;
            case 1:
                value = 'hangout';
                break;
            case 2:
                value = 'active';
                break;
            case 3 :
                value = 'stockedAnswers';
                break;
            case 4:
                value = 'sentAnswers';
                break;
            default:
                break;
        }
        this.props.setSort(value, this.props.sort.reversed);
    };

    render(){
        return(
            <Modal
                animationType={'slide'}
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => this.props.toggleSortDialogVisibility(false)}
            >
            <View style={styles.modalBlur}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        {'Trier les questionnaires'}
                    </Text>
                    <View style={styles.modalBody}>
                        <Text>
                            {'Choisissez l\'ordre des questionnaires'}
                        </Text>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.sort.by === 'name' ? true: false}
                                line={0}
                                column={0}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Selon le nom'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.sort.by === 'hangout' ? true: false}
                                line={0}
                                column={1}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Encadrés d\'abord'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.sort.by === 'active' ? true: false}
                                line={0}
                                column={2}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Actifs d\'abord'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.sort.by === 'stockedAnswers' ? true: false}
                                line={0}
                                column={3}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Selon les réponses stockées'}
                            </Text>
                        </View>
                        <View style={styles.modalRow}>
                            <FuckinRadioButton
                                checked={this.props.sort.by === 'sentAnswers' ? true: false}
                                line={0}
                                column={4}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Selon les réponses envoyées'}
                            </Text>
                        </View>
                        <View style={styles.modalSeparator}/>
                        <View style={styles.modalRow}>
                            <FuckinCheckbox
                                checked={this.props.sort.reversed === -1 ? true: false}
                                line={1}
                                column={0}
                                onChange={this.onChangeButton}
                            />
                            <Text>
                                {'Inverser l\'ordre'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.modalFooter}>
                    <TouchableWithoutFeedback onPress={() => this.props.toggleSortDialogVisibility(false)}>
                            <View>
                                <Text style={styles.modalFooterText}>
                                    {'FERMER'}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>                        
                    </View>
                </View>
            </View>
          </Modal>
        );
    }
} export default SortDialog;