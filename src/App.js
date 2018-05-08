import React from 'react'
import { Navigation } from 'react-native-navigation'
import { registerScreens } from './screens'

registerScreens();

const appStyle = {	
	navigationBarColor: '#000',
	navBarHidden: false,
	topBarElevationShadowEnabled: false	
}

Navigation.startSingleScreenApp({
    screen:{
        screen: 'offer_letter.login',
        title: '',
        navigatorStyle: appStyle
    }
})