import Cart from './components/Cart/Cart'
import Layout from './components/Layout/Layout'
import Products from './components/Shop/Products'
import Notification from './components/UI/Notification'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { sendCardData } from './store/cart-slice'

function App() {
  const dispatch = useDispatch()
  const showCart = useSelector(state => state.ui.cartIsVisible)
  const cart = useSelector(state => state.cart)
  const notification = useSelector(state => state.ui.notification)

  const isInitial = useRef(true)

  useEffect(() => {
    // If is the firs time that the App is runing, we don't send the cart to Firebase.
    if (isInitial.current) {
      isInitial.current = false
      return
    }
    // Dispathing a THUNK of cart-slice that will send the cart to Firebase and handle notifications
    dispatch(sendCardData(cart))
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
