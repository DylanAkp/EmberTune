import { StyleSheet } from 'react-native';

const sidebar = StyleSheet.create({
    sidebar: {
        height: "100%",
        width: "50%",
        maxWidth: 400,
        padding: 16,
        display: 'flex',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    }
});

const page = StyleSheet.create({
    content: {
        flex: 1,
        padding: 20,
    },
    text: {
        fontSize: 20,
    },
});

export { sidebar, page };