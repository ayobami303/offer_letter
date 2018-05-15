import {Navigation} from 'react-native-navigation'
import FormScreen from './FormScreen'
import Login from './Login'
import DTICalculator from "./DTICalculator";
import LightBox from "./util/LightBox";

export function registerScreens(){
    Navigation.registerComponent('offer_letter.form', () => FormScreen)
    Navigation.registerComponent('offer_letter.login', () => Login)
    Navigation.registerComponent('offer_letter.DTICalculator', () => DTICalculator)
    Navigation.registerComponent('offer_letter.LightBox', () => LightBox)
}