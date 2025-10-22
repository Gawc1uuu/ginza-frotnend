import { Referral } from "src/modules/referral/entities/referral.entity";
import { Affiliate } from "src/modules/user/entities/affiliate.entity";
import { PokerPreferences } from "src/modules/user/entities/poker-preferences.entity";
import Role from "src/modules/authorization/constants/role.enum";
import { DepositStatus } from "src/modules/deposit/constants/deposit-status.enum";

export enum GameProgressStatus {
  ACTIVE = 'ACTIVE',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Transaction {
  amount: bigint;
  time: Date;
}

export interface GameDetails {
  game_id: string;
  game_start_time: Date;
  last_action_time: Date;
  game_progress_status: GameProgressStatus;
  buy_in: bigint;
  rake: bigint;
  cashout: bigint;
}

export interface Transaction {
    amount: bigint;
    time: Date;
}

export interface GameDetails {
    game_id: string;
    game_start_time: Date;
    last_action_time: Date;
    game_progress_status: GameProgressStatus;
    buy_in: bigint;
    rake: bigint;
    cashout: bigint;
}

export enum GameHistoryType {
    BUY_IN = 'BUY_IN',
    CASH_OUT = 'CASH_OUT',
}

export interface FinancialData {
    monthlyBreakdown: Record<string, string>;
    total: string;
    surplusBalance: string;
  }

  export interface GameWithRevenueForMonth {
    gameId: string;
    revenue: string;
    gameExists: boolean;
    gameData: any;
  }

  export interface DirectDepositsData {
    monthlyBreakdown: Record<string, string>;
    total: string;
  }

  

  export interface DirectWithdrawalsData {
    monthlyBreakdown: Record<string, string>;
    total: string;
  }

export interface UserDto {
    id: string;
    convexId?: string;
    username: string;
    externalId: string;
    imageUrl: string;
    role?: Role;
    referralId?: string;
    affiliateId?: string;
    pokerPreferences?: PokerPreferences;
    referral?: Referral;
    affiliate?: Affiliate;
    convexReferralId?: string;
    twitterUsername?: string;
    createdAt: Date;
    _creationTime: number;
}

export interface ReferralDto {
    id: string;
    convexId?: string;
    convexAffiliateUserId?: string;
    convexReferredUserId?: string;
    affiliateUserId: string;
    referredUserId: string;
    affiliateCode: string;
    rate: number;
    amountEarned: string;
    expiresAt: Date;
    createdAt: Date;
    _creationTime: number;
    affiliateUser?: UserDto;
    referredUser?: UserDto;
    gameId?: string;
}

export interface AffiliateDto {
        userId: string;
        username: string;
        affiliateCode: string | undefined;
        rate: number | undefined;
        duration: number | undefined;
        totalReferrals: any;
        activeReferrals: any;
        totalEarnings: any;
        createdAt: number;
}




export interface DepositDto {
  id: string;
  convexId?: string;
  convexUserId?: string;
  userId: string;
  user: UserDto;
  tokenContractAddress: string;
  chainId: string;
  amount: string;
  status: DepositStatus;
  transactionHash: string;
  confirmationTimestamp?: Date;
  fastConfirmationTimestamp?: Date;
  feeRequestId?: string;
  feeTransactionHash?: string;
  forwardRequestId?: string;
  forwardTransactionHash?: string;
  forwarded?: boolean;
  createdAt: Date;
  _creationTime: string;
}

export interface DepositWithUserDto {
    deposit: DepositDto;
    user: UserDto;
}

export interface DepositWithUserResponseDto {
    depositsWithUsers: DepositWithUserDto[];
    totalItems: number;
}

export interface BatchActiveGameDataWithRevenueDto {
    games: any[];
    total: number;
}

export interface IGameData {
  id: string;
  convexId?: string;
  archived: boolean;
  gameData: Record<string, any>;
  gameType: number;
  visibility: number;
  updatedAt: Date;
  createdAt: Date;
  archivedAt?: Date;
}

export type EmptyGame = {
  gameData: null;
  gameLogs: never[];
  encryptedDecks: null;
};

export type GameDataResponse = IGameData | EmptyGame | null;

export interface GameStatisticsByMonthDto {
  [key: string]: {
    nlh: number;
    plo: number;
    nlhHands: number;
    ploHands: number;
    };
}

export interface ArchivedGameStatisticsByMonthDto {
  [key: string]: {
    nlhHands: number;
    ploHands: number;
  };
}




export interface GameRevenueBreakdownDto {
  adminRevenue: string;
  referrals:{
    userId:string;
    username:string;
    amount:string;
  }[];
  affiliates:{
    userId:string;
    username:string;
    amount:string;
  }[];
}

export interface GameLogDto {
  id: string;
  convexId?: string;
  gameId: string;
  convexGameId?: string;
  game: IGameData;
  logType: number;
  args: string[];
  createdAt: Date;
}

export interface RakeDto {
  id: string;
  convexId?: string;
  gameId: string;
  convexGameId?: string;
  game: IGameData;
  nonce: number;
  pot: Record<string, any>;
  rake: Record<string, any>;
  admin: Record<string, any>;
  host?: Record<string, any>;
  affiliate?: Record<string, any>;
  lossback?: Record<string, any>;
  createdAt: Date;
}

export interface LedgerDto {
  id: string;
  convexId?: string;
  amount: string;
  creditAccount: string;
  convexCreditAccount?: string;
  debitAccount: string;
  convexDebitAccount?: string;
  createdAt: Date;
  _creationTime: number;
}

export interface UserStatisticsDto {
  total:{
    userCount:number;
  };
  weekly:{
    newUserCount:number;
    activeUserCount:number;
  };
  monthly:{
    newUserCount:number;
    activeUserCount:number;
  };
}


export interface HostRewardsDto {
  userId: string;
  username: string;
  totalAmount: string;
  totalGames: number;
}

export interface HostRewardsWithPaginationDto {
  paginatedRewards: {
    gameId: any;
    amount:any;
    date:number;
  }[];
  totalCount: number;
}

export interface ReferralsWithPaginationDto {
  referrals:ReferralDto[];
  total: number;
}