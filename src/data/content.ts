export interface TopicContent {
  id: string;
  title: string;
  definition: string;
  quirkyExample: string;
  keyTakeaways: string[];
  deepDive: string;
}

export const topicContent: Record<string, TopicContent> = {
  'why-consensus': {
    id: 'why-consensus',
    title: 'Why Consensus?',
    definition: 'Consensus is the mechanism by which a group of independent participants in a network agree on a single source of truth, even if some of them fail or act maliciously.',
    quirkyExample: 'Imagine a group of friends trying to order pizza. Alice wants Pepperoni, Bob wants Mushroom, and Charlie (the malicious node) tells Alice he wants Pineapple but tells Bob he wants Olives. Without a consensus mechanism (like "Majority Vote" or "Whoever pays chooses"), they will never order, or worse, they order two different pizzas and fight over the bill.',
    keyTakeaways: [
      'Distributed systems have no central boss.',
      'Nodes must agree on the state (who owns what coin).',
      'The system must survive failures and attacks (Byzantine Faults).',
    ],
    deepDive: `
      In a centralized system (like a bank), the bank's database is the golden truth. If the bank says you have $50, you have $50. 
      
      In a decentralized blockchain, thousands of computers (nodes) have their own copy of the ledger. Due to network latency, Node A might see a transaction before Node B. If a malicious actor tries to double-spend (send the same coin to two people), the network needs a way to decide which transaction happened first and is valid. 
      
      This is the "Byzantine Generals Problem": How do you coordinate an attack when some messengers might be spies? Blockchain consensus algorithms like Proof of Work and Proof of Stake are the practical solutions to this mathematical problem.
    `
  },
  'pow-mining': {
    id: 'pow-mining',
    title: 'Proof of Work & Mining',
    definition: 'Proof of Work (PoW) forces participants (miners) to expend energy and computational power to solve a difficult mathematical puzzle. The first to solve it gets the right to add the next block.',
    quirkyExample: 'It is like a lottery where buying more tickets increases your chances of winning, but tickets cost electricity. Or imagine being forced to roll a pair of dice until you get double sixes 1,000 times in a row before you can speak in a meeting. It proves you put in the effort.',
    keyTakeaways: [
      'Mining is essentially guessing a random number (nonce).',
      'It effectively converts electricity into security.',
      'The "difficulty" adjusts to ensure blocks are found consistently (e.g., every 10 mins).',
    ],
    deepDive: `
      In PoW, miners collect pending transactions and hash them together with a random number called a 'nonce'. The goal is to find a hash that starts with a specific number of zeros. 
      
      Because hash functions are unpredictable, the only way to find this magic number is by brute force—guessing millions of times per second. 
      
      Why do this? It makes rewriting history expensive. To change a past block, an attacker would have to redo the work for that block AND all the blocks that came after it, catching up to the current chain which is constantly growing. This is economically infeasible for established networks like Bitcoin.
    `
  },
  'longest-chain': {
    id: 'longest-chain',
    title: 'Longest Chain Rule',
    definition: 'When two miners find a block at roughly the same time, the blockchain temporarily forks. The network follows the rule: "The valid chain with the most accumulated work (usually the longest one) is the truth."',
    quirkyExample: 'Imagine two queues forming at a supermarket checkout. Suddenly, the manager announces that only the longer line will actually get checked out. Everyone in the shorter line immediately abandons it and rushes to join the back of the longer line to ensure they get their groceries.',
    keyTakeaways: [
      'Forks happen naturally due to network latency.',
      'Nodes always switch to the heaviest/longest valid chain they see.',
      'Transactions in the abandoned branch (orphan blocks) go back to the memory pool.',
    ],
    deepDive: `
      Nakamoto Consensus relies on probabilistic finality. Sometimes, different parts of the network see different versions of the truth temporarily. 
      
      If Miner A finds Block 100 in the US, and Miner B finds a different Block 100 in China, the network splits. Some nodes build on A, some on B. 
      
      Eventually, someone will find Block 101 on top of chain A. Now chain A is longer (accumulated more proof of work). When the nodes on chain B see this longer chain, they perform a "chain reorganization" (reorg): they dump their version of Block 100 and accept the A chain as the true history. This is why you wait for "confirmations" before shipping goods.
    `
  },
  'pos-staking': {
    id: 'pos-staking',
    title: 'Proof of Stake',
    definition: 'Proof of Stake (PoS) selects validators to create new blocks based on the amount of native cryptocurrency they have locked up (staked) as collateral, rather than energy expenditure.',
    quirkyExample: 'It is like a shareholder meeting. The more shares (coins) you own, the more voting power you have. If you try to burn down the factory (attack the network), your share value plummets, so you are incentivized to behave.',
    keyTakeaways: [
      'No energy-intensive mining rigs needed.',
      'Security comes from financial value at risk (Slashing).',
      '"Nothing at Stake" was an early theoretical problem solved by slashing conditions.',
    ],
    deepDive: `
      In PoS, "miners" are replaced by "validators". To become a validator, you must deposit a large amount of coins into a smart contract.
      
      The network uses a pseudo-random algorithm to select a validator to propose the next block. The chance of being selected is proportional to your stake.
      
      If a validator acts maliciously (e.g., signs two conflicting blocks), the protocol can "slash" them, destroying part or all of their staked coins. This economic penalty enforces honest behavior more directly than the physical cost of electricity in PoW.
    `
  },
  'finality': {
    id: 'finality',
    title: 'Finality & Safety',
    definition: 'Finality is the guarantee that a transaction cannot be reversed or altered. It can be probabilistic (PoW) or deterministic (some PoS chains).',
    quirkyExample: 'Writing in pencil vs. writing in permanent marker. Sending a pending transaction is like a pencil sketch—it can be erased. After 6 confirmations, it is like going over it with a Sharpie. After 100, it is carved in stone.',
    keyTakeaways: [
      'Bitcoin has probabilistic finality (exponentially unlikely to revert).',
      'Some chains (like Cosmos) have instant finality (block is final once created).',
      'There is often a trade-off between Liveness (always running) and Safety (always correct).',
    ],
    deepDive: `
      In probabilistic finality (like Bitcoin), there is never a moment where a transaction is 100% theoretically immutable. However, after 6 blocks (about 1 hour), the cost to reverse the transaction exceeds the potential gain from double-spending, effectively making it final.
      
      In deterministic finality (like Tendermint/Cosmos or Ethereum's Gasper gadget), validators vote on blocks. Once 2/3rds of validators agree, the block is "finalized". It can never be reverted without a hard fork that burns 1/3rd of the total stake. This provides stronger safety guarantees but can cause the chain to halt if participation drops.
    `
  }
};
