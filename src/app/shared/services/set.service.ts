import { Injectable } from '@angular/core';
import { HttpHeaders, HttpRequest } from '@angular/common/http';
import {Game, Set} from '@app/shared/models';
import {AIService} from '@app/shared/services/ai-bid.service';

@Injectable()
export class SetService {
  constructor(private aiService: AIService){

  }

  startBidding(set: Set){
    while(!set.BiddingComplete) {
      this.aiService.getBid(set);
    }
  }
}
