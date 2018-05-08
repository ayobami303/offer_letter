import {Navigation} from 'react-native-navigation'
import FormScreen from './FormScreen'
import Login from './Login'


export function registerScreens(){
    Navigation.registerComponent('offer_letter.form', () => FormScreen)
    Navigation.registerComponent('offer_letter.login', () => Login)
}