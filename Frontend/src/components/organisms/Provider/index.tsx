'use client'

import { Provider } from 'react-redux'
import { store } from '@store/storage'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@services/config/queryClient'
import { NextUIProvider } from '@nextui-org/system'

export default function ContainerProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            theme="colored"
          />
          {children}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NextUIProvider>
    </Provider>
  )
}
