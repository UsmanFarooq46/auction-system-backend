/**
 * Data Transfer Objects for Auction
 */

class AuctionCreateDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.condition = data.condition;
    this.startingPrice = data.startingPrice;
    this.reservePrice = data.reservePrice || null;
    this.duration = data.duration;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.location = data.location;
    this.images = data.images || [];
  }
}

class AuctionResponseDTO {
  constructor(auction) {
    this.id = auction._id;
    this.title = auction.title;
    this.description = auction.description;
    this.category = auction.category;
    this.condition = auction.condition;
    this.seller = auction.seller;
    this.startingPrice = auction.startingPrice;
    this.reservePrice = auction.reservePrice;
    this.currentBid = auction.currentBid;
    this.startDate = auction.startDate;
    this.endDate = auction.endDate;
    this.duration = auction.duration;
    this.location = auction.location;
    this.images = auction.images;
    this.status = auction.status;
    this.totalBids = auction.totalBids;
    this.highestBidder = auction.highestBidder;
    this.createdAt = auction.createdAt;
    this.updatedAt = auction.updatedAt;
  }
}

class AuctionListDTO {
  constructor(auction) {
    this.id = auction._id;
    this.title = auction.title;
    this.category = auction.category;
    this.condition = auction.condition;
    this.startingPrice = auction.startingPrice;
    this.currentBid = auction.currentBid;
    this.images = auction.images && auction.images[0] ? auction.images[0] : null;
    this.status = auction.status;
    this.totalBids = auction.totalBids;
    this.endDate = auction.endDate;
    this.seller = {
      id: auction.seller._id,
      firstName: auction.seller.firstName,
      lastName: auction.seller.lastName
    };
  }
}

module.exports = {
  AuctionCreateDTO,
  AuctionResponseDTO,
  AuctionListDTO
};
