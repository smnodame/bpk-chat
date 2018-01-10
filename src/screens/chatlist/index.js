import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import _ from 'lodash';
import {
  RkStyleSheet,
  RkText,
  RkTextInput,
  RkButton
} from 'react-native-ui-kitten';
import { Thumbnail, Button, Text } from 'native-base';
import {Avatar} from '../../components';
import {FontAwesome} from '../../assets/icons';
import {data} from '../../data';
let moment = require('moment');
import Modal from 'react-native-modal';
import {store} from '../../redux'

export default class ChatList extends React.Component {
    static navigationOptions = {
        title: 'Chats List'.toUpperCase()
    };

    constructor(props) {
        super(props);
        this.renderHeader = this._renderHeader.bind(this);
        this.renderItem = this._renderItem.bind(this);
        this.state = {
            data: []
        }
    }

    // componentDidMount() {
    // // this.chats = data.getChatList();
    // // this.setState({
    // //   data: this.chats
    // // });
    // }

    updateData = () => {
        const state = store.getState()
        this.setState({
            chatLists: _.get(state, 'chat.chatLists', [])
        })
        console.log('===================')
        console.log(_.get(state, 'chat.chatLists', []))
    }

	async componentWillMount() {
        this.updateData()
		store.subscribe(() => {
            this.updateData()
		})
    }

    _filter(text) {
        let pattern = new RegExp(text, 'i');
        let chats = _.filter(this.chats, (chat) => {

            if (chat.withUser.firstName.search(pattern) != -1
            || chat.withUser.lastName.search(pattern) != -1)
                return chat;
        });

        this.setState({data: chats});
    }

    _keyExtractor(item, index) {
        return item.withUser.id;
    }

    _renderSeparator() {
        return (
            <View style={styles.separator}/>
        )
    }

    _renderHeader() {
        return (
            <View style={styles.searchContainer}>
                <RkTextInput autoCapitalize='none'
                    autoCorrect={false}
                    onChange={(event) => this._filter(event.nativeEvent.text)}
                    label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
                    rkType='row'
                    placeholder='Search'/>
            </View>
        )
    }

  _renderItem(info) {
    let name = `${info.item.withUser.firstName} ${info.item.withUser.lastName}`;
    let last = info.item.messages[info.item.messages.length - 1];
    return (
        <TouchableWithoutFeedback onPress={() =>  this.props.screenProps.rootNavigation.navigate('Chat')} onLongPress={() => this.setState({showPickerModal: true})}>
          <View style={styles.container}>
          <Thumbnail source={{ uri: 'https://www.billboard.com/files/styles/480x270/public/media/taylor-swift-1989-tour-red-lipstick-2015-billboard-650.jpg'}} />
            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <RkText rkType='header5'>{name}</RkText>
                <RkText rkType='secondary4 hintColor'>
                  {moment().add(last.time, 'seconds').format('LT')}
                </RkText>
              </View>
              <RkText numberOfLines={2} rkType='primary3 mediumLine'>{last.text}</RkText>
            </View>
          </View>
        </TouchableWithoutFeedback>
    )
  }

  render() {
    return (
    <View>
        <FlatList
          style={styles.root}
          data={this.state.data}
          extraData={this.state}
          ListHeaderComponent={this.renderHeader}
          ItemSeparatorComponent={this._renderSeparator}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}/>
          <Modal
              onRequestClose={() => this.setState({ showPickerModal: false })}
              onBackdropPress={() => this.setState({ showPickerModal: false })}
              isVisible={this.state.showPickerModal}
          >
              <View style={{
                  backgroundColor: 'white',
                  borderRadius: 4,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
              }}>
                <Button block light>
                    <Text>Chat</Text>
                </Button>
                <Button block light>
                    <Text>Mute</Text>
                </Button>
                <Button block light>
                    <Text>Block Chat</Text>
                </Button>
                <Button block light>
                    <Text>Delete</Text>
                </Button>
              </View>
          </Modal>
    </View>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  searchContainer: {
    backgroundColor: theme.colors.screen.bold,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 60,
    alignItems: 'center'
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row'
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  }
}));
