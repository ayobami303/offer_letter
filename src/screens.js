import {Navigation} from 'react-native-navigation'
import FormScreen from './FormScreen'


export function registerScreens(){
    Navigation.registerComponent('offer_letter.form', () => FormScreen)
}