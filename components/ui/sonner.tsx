"use client"

// import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // const { theme = "system" } = useTheme() // Currently not used

  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        classNames: {
          toast: "group toast bg-white text-gray-900 border-gray-200 shadow-lg rounded-xl",
          title: "text-gray-900 font-semibold text-sm",
          description: "text-gray-600 text-sm font-normal",
          actionButton: "bg-green-600 text-white hover:bg-green-700 font-medium px-3 py-1.5 rounded-lg text-sm",
          cancelButton: "bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-3 py-1.5 rounded-lg text-sm",
          closeButton: "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
          success: "bg-green-50 border-green-200 text-green-800",
          error: "bg-red-50 border-red-200 text-red-800",
          warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
          info: "bg-blue-50 border-blue-200 text-blue-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
