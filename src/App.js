import Cart from './components/Cart/Cart'
import Layout from './components/Layout/Layout'
import Products from './components/Shop/Products'
import Notification from './components/UI/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { uiActions } from './store/ui-slice'

function App() {
  const dispatch = useDispatch()
  const showCart = useSelector(state => state.ui.cartIsVisible)
  const cart = useSelector(state => state.cart)
  const notification = useSelector(state => state.ui.notification)

  const isInitial = useRef(true)

  useEffect(() => {
    //------------------------------------- Notification types
    function notificateSuccess() {
      dispatch(
        uiActions.showNotification({
          status: 'success',
          title: 'Success',
          message: 'Sent cart data successfully!',
        })
      )
    }
    function notificateError() {
      dispatch(
        uiActions.showNotification({
          status: 'error',
          title: 'Error!',
          message: 'Sending cart data failed!',
        })
      )
    }
    function notiicatePending() {
      dispatch(
        uiActions.showNotification({
          status: 'pending',
          title: 'Sending',
          message: 'Sending cart data...',
        })
      )
    }
    //------------------------------------- Notification types

    async function sendCartData() {
      notiicatePending()
      const response = await fetch(
        'https://redux-advanced-93b6c-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        }
      )
      if (!response.ok) {
        throw new Error('Sending cart data failed.')
      }
      notificateSuccess()
    }

    // If is the firs time that the App is runing, we don't send the cart to Firebase.
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    // Send cart data to Firebase
    sendCartData().catch(error => {
      notificateError()
    })
  }, [cart, dispatch])

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  )
}

export default App
