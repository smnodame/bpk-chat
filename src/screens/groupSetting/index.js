import _ from 'lodash'
import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from 'react-native-ui-kitten';
import { NavigationActions } from 'react-navigation'
import {data} from '../../data';
import {FontAwesome} from '../../assets/icons';
import { Thumbnail, Button, Text, Icon, Container, Content, Header, Title, Left, Body, Right } from 'native-base';
import ImagePicker from 'react-native-image-picker'
import {store} from '../../redux'
import axios from 'axios'
import RNFetchBlob from 'react-native-fetch-blob'

const fs = RNFetchBlob.fs

export default class GroupSetting extends React.Component {
  static navigationOptions = {
    title: 'Profile Settings'.toUpperCase()
  };

  constructor(props) {
    super(props);
    // this.user = data.getUser();

    this.state = {
    }
  }

  updateData = () => {
      const state = store.getState()
      this.setState({
          display_name: _.get(this.props.navigation.state.params.selectedFriend, 'display_name', ''),
          wall_pic_url: _.get(this.props.navigation.state.params.selectedFriend, 'wall_pic_url', ''),
          profile_pic_url: _.get(this.props.navigation.state.params.selectedFriend, 'profile_pic_url', '')
      })
  }

  async componentWillMount() {
      this.updateData()
      console.log(this.props.navigation.state.params.selectedFriend)
  }

  selectProfileImage = () => {
      ImagePicker.showImagePicker({
          title: 'Select Profile Image',
          storageOptions: {
            skipBackup: true,
            path: 'images'
        },
        mediaType: 'photo',
        noData: false
      }, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
              console.log('User cancelled image picker')
          }
          else if (response.error) {
              console.log('ImagePicker Error: ', response.error)
          }
          else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton)
          }
          else {
              this.setState({
                  profile_pic_url: response.uri,
                  profile_pic_base64: response.data || ''
              })
          }
      })
  }

  selectWallImage = () => {
      ImagePicker.showImagePicker({
          title: 'Select Wall Image',
          storageOptions: {
            skipBackup: true,
            path: 'images'
        },
        mediaType: 'photo',
        noData: false
      }, (response) => {
          console.log('Response = ', response);

          if (response.didCancel) {
              console.log('User cancelled image picker')
          }
          else if (response.error) {
              console.log('ImagePicker Error: ', response.error)
          }
          else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton)
          }
          else {
              this.setState({
                  wall_pic_url: response.uri,
                  wall_pic_base64: response.data || ''
              })
          }
      })
  }

   _updateGroupSetting = async () => {
      const oldSetting = this.props.navigation.state.params.selectedFriend
      if (
          this.props.navigation.state.params.selectedFriend.wall_pic_url != this.state.wall_pic_url ||
          this.props.navigation.state.params.selectedFriend.profile_pic_url != this.state.profile_pic_url
      ) {
          if(!this.state.profile_pic_base64) {
              await RNFetchBlob.config({
                         fileCache : true
                    })
                       .fetch('GET', this.state.profile_pic_url)
                       // the image is now dowloaded to device's storage
                       .then((resp) => {
                           // the image path you can use it directly with Image component
                           imagePath = resp.path()
                           console.log(resp.readFile('base64'))
                           return resp.readFile('base64')
                       })
                       .then((base64Data) => {
                           // here's base64 encoded image
                           // base64Data
                           this.setState({
                               profile_pic_base64: base64Data
                           })
                           // remove the file from storage
                           return fs.unlink(imagePath)
                       })
          }
          if(!this.state.wall_pic_base64) {
              await RNFetchBlob.config({
                         fileCache : true
                    })
                       .fetch('GET', this.state.wall_pic_url)
                       // the image is now dowloaded to device's storage
                       .then((resp) => {
                           // the image path you can use it directly with Image component
                           imagePath = resp.path()
                           console.log(resp.readFile('base64'))
                           return resp.readFile('base64')
                       })
                       .then((base64Data) => {
                           // here's base64 encoded image
                           // base64Data
                           this.setState({
                               wall_pic_base64: base64Data
                           })
                           // remove the file from storage
                           return fs.unlink(imagePath)
                       })
          }
          const resUpdatePicture = await axios.post("http://itsmartone.com/bpk_connect/api/group/update_setting?token=asdf1234aaa", {
              chat_room_id: oldSetting.chat_room_id,
              profile_pic_base64: this.state.profile_pic_base64,
              wall_pic_base64: this.state.wall_pic_base64
          })
      }


      await axios.post("http://itsmartone.com/bpk_connect/api/group/update_setting?token=asdf1234aaa", {
          chat_room_id: oldSetting.chat_room_id,
          display_name: this.state.display_name
      }).then((res) => {
          console.log(res)
      }, (err) => {
          console.log(err)
      })
      this.props.navigation.dispatch(NavigationActions.back())

  }

  render() {
    return (
    <Container style={{ backgroundColor: '#FFF' }}>
        <Header style={{ backgroundColor: '#3b5998' }}>
            <Left>
                <Button transparent onPress={() => this.props.navigation.dispatch(NavigationActions.back())}>
                    <Icon name="md-arrow-round-back" />
                </Button>
            </Left>
            <Body>
                <Title>GROUP SETTIING</Title>
            </Body>
            <Right>
                <Button transparent onPress={() => this._updateGroupSetting() }>
                    <Icon name="md-checkmark" />
                </Button>
            </Right>
        </Header>
        <Content>
          <ScrollView style={styles.root}>
            <RkAvoidKeyboard>
            <View style={{ height: 220 , backgroundColor: '#fafafa'}}>
                <Image
                    style={{width: '100%', height: 150, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
                    source={{uri: this.state.wall_pic_url}}
                />
                <Button
                    transparent
                    dark
                    onPress={() => {
                        this.selectWallImage()
                    }}
                    style={{
                        position: 'absolute',
                        top: 5,
                        right: 5,
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    }}
                >
                    <Text>UPDATE WALL PHOTO</Text>
                </Button>
                <TouchableHighlight
                    style={{
                            width: 110,
                            height: 110,
                            borderRadius: 55,
                            borderColor: 'white',
                            borderWidth: 1,
                            position: 'absolute',
                            top: 95,
                            left: '50%',
                            marginLeft: -55
                        }}
                     onPress={() => {
                         this.selectProfileImage()
                     }}
                 >
                    <View>
                        <Image
                            style={{
                                width: 110,
                                height: 110,
                                borderRadius: 55
                            }}
                            source={{uri: this.state.profile_pic_url}}
                        />
                        <Button
                            block
                            transparent
                            dark
                            style={{
                                position: 'absolute',
                                width: 100,
                                height: 30,
                                marginLeft: -50,
                                bottom: 0,
                                left: '50%',
                                zIndex: 999,
                                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            }}>
                            <Text>EDIT</Text>
                        </Button>
                    </View>
                </TouchableHighlight>
            </View>
            <View>
            </View>
              <View style={styles.section}>
                <View style={[styles.row, styles.heading]}>
                  <RkText rkType='header6 primary'>INFO</RkText>
                </View>
                <View style={styles.row}>
                  <RkTextInput label='Display Name'
                               value={this.state.display_name}
                               rkType='right clear'
                               onChangeText={(text) => this.setState({display_name: text})}/>
                </View>
              </View>
            </RkAvoidKeyboard>
          </ScrollView>
        </Content>
        </Container>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 12.5
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 32
  }
}));


//   <View style={styles.section}>
//     <View style={[styles.row, styles.heading]}>
//       <RkText rkType='primary header6'>CHANGE PASSWORD</RkText>
//     </View>
//     <View style={styles.row}>
//       <RkTextInput label='Old Password'
//                    value={this.state.password}
//                    rkType='right clear'
//                    secureTextEntry={true}
//                    onChangeText={(text) => this.setState({password: text})}/>
//     </View>
//     <View style={styles.row}>
//       <RkTextInput label='New Password'
//                    value={this.state.newPassword}
//                    rkType='right clear'
//                    secureTextEntry={true}
//                    onChangeText={(text) => this.setState({newPassword: text})}/>
//     </View>
//     <View style={styles.row}>
//       <RkTextInput label='Confirm Password'
//                    value={this.state.confirmPassword}
//                    rkType='right clear'
//                    secureTextEntry={true}
//                    onChangeText={(text) => this.setState({confirmPassword: text})}/>
//     </View>
//   </View>