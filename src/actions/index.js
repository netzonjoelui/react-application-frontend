import fetch from 'isomorphic-fetch';
import { updateOnline } from './device';

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';

/**
 * Export all module actions
 */
export * from './module';
export * from './entity';
export * from './entityCollection';
export * from './browserView';
export * from './device';


// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
export function sendHearbeat(server, token) {

  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function (dispatch) {

    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    //dispatch(requestPosts(subreddit))

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.
    return fetch(`${server}/svr/authentication/checkin`, {
        method: 'POST',
        headers: {
          'Authentication': token
        }}
      )
      .then(response => response.json())
      .then((json) => {
        dispatch(updateOnline((json.result === "OK")));
        }
      ).catch((error) => {
        // TODO: We should probably dispatch another action for the error
        console.log('request failed', error)
      });
  }
}