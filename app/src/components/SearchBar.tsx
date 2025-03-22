"use client"
import React, { useState } from 'react'
import { Input } from './ui/input'

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

        
  return (
    <div className="flex flex-col justify-center items-center px-4">
        <Input placeholders={["Search for a funder", "Search for a fundee"]} onChange={() => {}} onSubmit={() => {}} />
    </div>>
  )
}

export default SearchBar