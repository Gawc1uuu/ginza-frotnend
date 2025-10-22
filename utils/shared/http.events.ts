export enum HttpQueries {
  getGameDataPublic = 'query_getGameDataPublic',
  getUserByUserId = 'query_getUserByUserId',
  getGameTransactionsForUser = 'query_getGameTransactionsForUser',
  getGameHistoryWithRevenue = 'query_getGameHistoryWithRevenue',
  getAccountBalance = 'query_getAccountBalance',
  getLifetimeRewards = 'query_getLifetimeRewards',
  getLifetimeAffiliateRewardsForUser = 'query_getLifetimeAffiliateRewardsForUser',
  getTransactionsForUser = 'query_getTransactionsForUser',
  getActivePokerGamesSummary = 'query_getActivePokerGamesSummary',
  getLedgerActivityForUser = 'query_getLedgerActivityForUser',
  getUserByUsername = 'query_getUserByUsername',
  checkAdminAccess = 'query_checkAdminAccess',
  getHandHistoryLogs = 'query_getHandHistoryLogs',
  getBatchDataPublic = 'query_getBatchDataPublic',
  getPaginatedGamesForUser = 'query_getPaginatedGamesForUser',
  getAffiliatePageData = 'query_getAffiliatePageData',
}

export enum HttpMutations {
  processReferralByClerkId = 'mutation_processReferralByClerkId',
  batchGetGameDataPublic = 'mutation_batchGetGameDataPublic',
  requestWithdrawal = 'mutation_requestWithdrawal',
}

export enum HttpNamespaces {
  GAME = 'game',
  USER = 'user',
  LEDGER = 'ledger',
  WITHDRAWAL = 'withdrawal',
}