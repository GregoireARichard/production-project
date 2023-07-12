export type StructuredErrors = 
  // SQL
  'sql/failed' |  
  'sql/not-found' |

  // Crud
  'validation/failed' | 
    
  // Authorization
  'auth/missing-email' |
  'auth/missing-group-id' |
  'auth/unknown-email' |
  'auth/missing-magic-link-token' |
  'auth/invalid-magic-link-token' |
  'auth/missing-header' |
  'auth/access-token-expired' |
  'auth/invalid-access-token' |

  //registration
  'user/register/user-already-exists' |
  // SSH
  'ssh/connexion failed' |

  //MySQL
  'mysql/connexion failed' |

  // Default
  'internal/unknown'
;