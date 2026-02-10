"use client";  // Add this line at the top

import { useEffect } from 'react';

export default function FirebaseInit() {
  useEffect(() => {
    // Any client-side initialization can go here
    // But in this case, you might not need any initialization
    console.log('Firebase client-side initialization');
  }, []);

  return null;
}
