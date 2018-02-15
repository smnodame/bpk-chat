import React from 'react'
import {
  ListView,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'
import _ from 'lodash'
import {
  RkStyleSheet,
  RkText,
  RkTextInput
} from 'react-native-ui-kitten'
import Modal from 'react-native-modal'
import {
    Container,
    Header,
    Content,
    Footer,
    FooterTab,
    Button,
    Icon,
    Text,
    List,
    ListItem,
    Left,
    Body,
    Right,
    Thumbnail,
    Title,
    Badge,
    Item,
    Input
} from 'native-base';
import {Avatar} from '../../components/avatar'
import {FontAwesome} from '../../assets/icons'
import { NavigationActions } from 'react-navigation'

import { enterContacts, removeFavorite, addFavorite, showOrHideFriendLists, onLoadMore, onSearchFriend, selectChat } from '../../redux/actions.js'
import {store} from '../../redux'

export default class RecieveMessage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showProfileModal: false,
            showFriendModal: false,
            friends: {
                favorite: [],
                other: [],
                group: [],
                department: []
            },
            showFavoriteFriendLists: false,
            showGroupFriendLists: false,
            showOtherFriendLists: false,
            showDepartmentFriendLists: false,
            showProfileFriendLists: false,
            selectedFriend: {
                is_favorite: 'F'
            },
            numberOfFriendLists: {
                favorite: 0,
                other: 0,
                group: 0,
                department: 0
            },
            filter: ''
        }

        this.renderHeader = this._renderHeader.bind(this)
    }

    updateData = () => {
        const state = store.getState()
        this.setState({
            friends: _.get(state, 'friend.friends', {
                favorite: [],
                other: [],
                group: [],
                department: []
            }),
            showFavoriteFriendLists: _.get(state, 'system.isShowFriendLists.favorite', false),
            showGroupFriendLists: _.get(state, 'system.isShowFriendLists.group', false),
            showDepartmentFriendLists: _.get(state, 'system.isShowFriendLists.department', false),
            showOtherFriendLists: _.get(state, 'system.isShowFriendLists.other', false),
            user: _.get(state, 'user.user', {}),
            numberOfFriendLists: {
                favorite: _.get(state, 'friend.numberOfFriendLists.favorite', 0),
                other: _.get(state, 'friend.numberOfFriendLists.other', 0),
                group: _.get(state, 'friend.numberOfFriendLists.group', 0),
                department: _.get(state, 'friend.numberOfFriendLists.department', 0),
            }
        })
    }

	async componentWillMount() {
        this.updateData()
		store.subscribe(() => {
            this.updateData()
		})
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

    loadmore = (group) => {
        store.dispatch(onLoadMore(group))
    }

    _showOrHideFriendLists = (type) => {
        let favorite = this.state.showFavoriteFriendLists
        let group = this.state.showGroupFriendLists
        let department = this.state.showDepartmentFriendLists
        let other = this.state.showOtherFriendLists
        if(type=='favorite') {
            favorite = !favorite
        } else if(type=='group') {
            group = !group
        } else if(type=='department') {
            department = !department
        } else if(type=='other') {
            other = !other
        }
        store.dispatch(
            showOrHideFriendLists({
                favorite,
                group,
                department,
                other,
            })
        )
    }

    renderGroups = () => {
        return this.state.friends.group.filter((friend) => {
            return true
        }).map((friend) => {
            return (
                <TouchableOpacity key={friend.friend_user_id} onPress={() => this.setState({ selectedFriend: friend })}>
                  <View style={styles.container}>
                      <Thumbnail  style={styles.avatar}  source={{ uri: friend.profile_pic_url }} />
                      <View style={{ flexDirection: 'column' }}>
                          <RkText rkType='header5'>{ friend.display_name }</RkText>
                          <RkText rkType='secondary4 hintColor'>{ friend.status_quote }</RkText>
                      </View>
                  </View>
                </TouchableOpacity>
            )
        })
    }

    renderFavorite = () => {
        return this.state.friends.favorite.filter((friend) => {
            return true
        }).map((friend) => {
            return (
                <View>
                    <TouchableOpacity key={friend.friend_user_id} onPress={() => this.setState({ selectedFriend: friend })}>
                      <View style={styles.container}>
                          <Thumbnail  style={styles.avatar}  source={{ uri: friend.profile_pic_url }} />
                          <View style={{ flexDirection: 'column' }}>
                              <RkText rkType='header5'>{ friend.display_name }</RkText>
                              <RkText rkType='secondary4 hintColor'>{ friend.status_quote }</RkText>
                          </View>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                </View>
            )
        })
    }

    renderOthers = () => {
        return this.state.friends.other.filter((friend) => {
            return true
        }).map((friend) => {
            return (
                <View>
                    <TouchableOpacity key={friend.friend_user_id} onPress={() => this.setState({ selectedFriend: friend })}>
                        <View style={styles.container}>
                            <Thumbnail  style={styles.avatar}  source={{ uri: friend.profile_pic_url }} />
                            <View style={{ flexDirection: 'column' }}>
                                <RkText rkType='header5'>{ friend.display_name }</RkText>
                                <RkText rkType='secondary4 hintColor'>{ friend.status_quote }</RkText>
                            </View>
                        </View>
                        </TouchableOpacity>
                    <View style={styles.separator}/>
                </View>

            )
        })
    }

    renderDepartment = () => {
        return this.state.friends.department.filter((friend) => {
            return true
        }).map((friend, key) => {
            return (
                <View>
                    <TouchableOpacity key={key} onPress={() => this.setState({ selectedFriend: friend })}>
                        <View style={styles.container}>
                            <Thumbnail  style={styles.avatar}  source={{ uri: friend.profile_pic_url }} />
                            <View style={{ flexDirection: 'column' }}>
                                <RkText rkType='header5'>{ friend.display_name }</RkText>
                                <RkText rkType='secondary4 hintColor'>{ friend.status_quote }</RkText>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.separator}/>
                </View>

            )
        })
    }

    render() {
    return (
        <Container>
            <Header style={{ backgroundColor: '#3b5998' }}>
                <Left>
                    <Button transparent onPress={() => {
                        store.dispatch(onSearchFriend(''))
                        this.props.navigation.dispatch(NavigationActions.back())
                    }}>
                        <Icon style={{ color: 'white' }} name="md-arrow-round-back" />
                    </Button>
                </Left>
                <Body>
                    <Title>FORWARD</Title>
                </Body>
                <Right>
                </Right>
            </Header>
            <Content>
                <View style={styles.searchContainer}>
                  <RkTextInput
                        onSubmitEditing={() =>
                            store.dispatch(onSearchFriend(this.state.filter))
                        }
                        onChangeText={(filter) => this.setState({
                            filter: filter
                        })}
                        autoCapitalize='none'
                        autoCorrect={false}
                        label={<RkText rkType='awesome'>{FontAwesome.search}</RkText>}
                        rkType='row'
                        placeholder='Search'/>
                </View>

                <TouchableOpacity
                    style={{
                        paddingTop: 10, paddingBottom: 10, paddingLeft: 15,
                        backgroundColor: '#fafafa', borderBottomColor: '#eaeaea',
                        borderBottomWidth: 0.5, flexDirection: 'row'
                    }}
                    onPress={() => this._showOrHideFriendLists('favorite')}
                >
                    <RkText rkType='header6 hintColor'>{`Favorites (${this.state.friends.favorite.length})`}</RkText>
                    <View style={{ flex: 1 }} />
                </TouchableOpacity>
                <View style={{ backgroundColor: 'white' }}>
                    {
                        !!this.state.showFavoriteFriendLists&&this.renderFavorite()
                    }
                </View>
                <TouchableOpacity
                    style={{
                        paddingTop: 10, paddingBottom: 10, paddingLeft: 15,
                        backgroundColor: '#fafafa', borderBottomColor: '#eaeaea',
                        borderBottomWidth: 0.5
                    }}
                    onPress={() => this._showOrHideFriendLists('group')}
                >
                    <RkText rkType='header6 hintColor'>{`Groups (${this.state.numberOfFriendLists.group})`}</RkText>
                </TouchableOpacity>
                <View style={{ backgroundColor: 'white' }}>
                    {
                        !!this.state.showGroupFriendLists&&<View>
                            {
                                this.renderGroups()
                            }
                            {
                                this.state.numberOfFriendLists.group > this.state.friends.group.length &&
                                <View>
                                    <Button block light style={{ backgroundColor: 'white' }} onPress={() => this.loadmore('group')}>
                                        <Text>Load More</Text>
                                    </Button>
                                </View>
                            }
                        </View>
                    }
                </View>
                <TouchableOpacity
                    style={{
                        paddingTop: 10, paddingBottom: 10, paddingLeft: 15,
                        backgroundColor: '#fafafa', borderBottomColor: '#eaeaea',
                        borderBottomWidth: 0.5
                    }}
                    onPress={() => this._showOrHideFriendLists('department')}
                >
                    <RkText rkType='header6 hintColor'>{`Departments (${this.state.numberOfFriendLists.department})`}</RkText>
                </TouchableOpacity>
                <View style={{ backgroundColor: 'white' }}>
                    {
                        !!this.state.showDepartmentFriendLists&&<View>
                            {
                                this.renderDepartment()
                            }
                            {
                                this.state.numberOfFriendLists.department > this.state.friends.group.department &&
                                <View>
                                    <Button block light style={{ backgroundColor: 'white' }} onPress={() => this.loadmore('department')}>
                                        <Text>Load More</Text>
                                    </Button>
                                </View>
                            }
                        </View>
                    }
                </View>
                <View>
                    <TouchableOpacity
                        style={{
                            paddingTop: 10, paddingBottom: 10, paddingLeft: 15,
                            backgroundColor: '#fafafa', borderBottomColor: '#eaeaea',
                            borderBottomWidth: 0.5
                        }}
                        onPress={() => this._showOrHideFriendLists('other')}
                    >
                        <RkText rkType='header6 hintColor'>{`Others (${this.state.numberOfFriendLists.other})`}</RkText>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: 'white' }}>
                        {
                            !!this.state.showOtherFriendLists&&<View>
                                {
                                    this.renderOthers()
                                }
                                {
                                    this.state.numberOfFriendLists.other > this.state.friends.other.length &&
                                    <View>
                                        <Button block light style={{ backgroundColor: 'white' }} onPress={() => this.loadmore('other')}>
                                            <Text>Load More</Text>
                                        </Button>
                                    </View>
                                }
                            </View>
                        }

                    </View>
                </View>
            </Content>
        </Container>
    )}
}
// renderHeader={this.renderHeader}
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
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center'
  },
  avatar: {
    marginRight: 16
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border.base
  }
}));
