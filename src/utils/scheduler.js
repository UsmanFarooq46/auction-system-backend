const cron = require('node-cron');
const AuctionService = require('../api/services/auction.service');

/**
 * Initialize background tasks for the auction system
 */
const initScheduler = () => {
  console.log('[Scheduler] Initializing background tasks...');

  // Run status refresh every minute
  // Pattern: * * * * * (minute hour day month day-of-week)
  cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Running minute-ly status refresh...');
    try {
      await AuctionService.refreshAuctionStatuses();
    } catch (error) {
      console.error('[Scheduler] Error in status refresh task:', error);
    }
  });

  // Run status refresh immediately on startup
  AuctionService.refreshAuctionStatuses();
  
  console.log('[Scheduler] Background tasks scheduled successfully');
};

module.exports = { initScheduler };
