import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED, 
    LOGIN_USER_SUCCESS, 
    LOGIN_USER_FAIL,
    LOGIN_USER 
} from './types';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const loginUser = ({ email, password }) => {
    //action creator returning function because redux-thunk
    // dispatch is a method that allow us to manually send an action
        // of to all reducers
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });

        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(user => loginUserSuccess(dispatch, user))
        .catch((error) => {
            console.log(error);

            firebase.auth().createUserWithEmailAndPassword(email, password)
                // can be change with loginUserSuccess helper function
                    //(because both of them is identical) 
                .then(user => {
                    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
                })
                .catch(() => loginUserFail(dispatch));
        });
    };
};

const loginUserFail = (dispatch) => {
    dispatch({ type: LOGIN_USER_FAIL });
};

//helper function
const loginUserSuccess = (dispatch, user) => {
    dispatch({ type: LOGIN_USER_SUCCESS, payload: user });
    
    // employeeList() is from Scene Key
    Actions.employeeList();
};

