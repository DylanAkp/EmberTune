import { Platform, StyleSheet } from 'react-native';

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

const searchBar = StyleSheet.create({
    searchContainer: {
        flex: 1,
        alignItems: 'center',
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 30,
      padding: 5,
      justifyContent: 'center',
      maxWidth: 500,
    },
    searchInput: {
      flex: 1,
      maxWidth: 500,
      height: 50,
      borderRadius: 25,
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 14,
      fontSize: 16,
      fontFamily: Platform.select({
        windows: 'Assets/Fredoka-Regular.ttf#Fredoka',
        default: 'Fredoka-Regular',
      }),
    },
    searchIcon: {
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      marginLeft: 10,
      cursor: 'pointer',
    },
  });

export { sidebar, page, searchBar };