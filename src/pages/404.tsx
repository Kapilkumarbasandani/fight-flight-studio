import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="description" content="Page not found" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="text-lg text-gray-600">Sorry, we couldn't find the page you requested. This page may have been moved, deleted, or never existed.</p>
            <Button asChild>
              <Link href="/">
                Return to home page
              </Link>
            </Button>
          </div>
        </div>
        <footer className="py-6 bg-white border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Enabled by <span className="text-green-600 font-semibold">Ikara.Club</span>
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
