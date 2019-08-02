import { StyleSheet, Dimensions } from 'react-native';

import { COLOR_PALETTE } from '../../config/theme';

const styles = StyleSheet.create({
    modalBlur: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: COLOR_PALETTE.semiTransparentBlack,
    },
    modalContainer: {
        position: 'absolute',
        top: 75,
        right: 25,
        left: 25,
        maxHeight: Dimensions.get('window').height - 150,
        backgroundColor: COLOR_PALETTE.white,
        borderRadius: 2,
        padding: 5,
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        padding: 5,
        marginBottom: 5,
        color: COLOR_PALETTE.black,
    },
    modalSubtitle: {
        fontSize: 18,
        padding: 2,
        marginBottom: 5,
    },
    modalBody: {
        marginBottom: 60,
        paddingLeft: 5,
    },
    modalFooter: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: COLOR_PALETTE.white,
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    modalFooterText: {
        marginRight: 30,
        marginVertical: 20,
        textAlign: 'right',
        color: COLOR_PALETTE.primaryColor.P500,
        fontSize: 14,
    },
    modalRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    modalSeparator: {
        display: 'flex',
        marginLeft: 5,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_PALETTE.gray,
    },
    modalText: {
        flex: 1,
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default styles;