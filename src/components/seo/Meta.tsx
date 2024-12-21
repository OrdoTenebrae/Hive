"use client"

import Head from 'next/head'

interface MetaProps {
  title: string
  description?: string
  keywords?: string
  ogImage?: string
  noIndex?: boolean
}

export function Meta({ 
  title, 
  description = "Manage your projects and collaborate with your team efficiently",
  keywords = "project management, team collaboration, task tracking",
  ogImage = "/og-image.jpg",
  noIndex = false 
}: MetaProps) {
  const fullTitle = `${title} | Hive`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
    </Head>
  )
} 