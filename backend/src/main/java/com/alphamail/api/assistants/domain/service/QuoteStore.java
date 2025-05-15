package com.alphamail.api.assistants.domain.service;

import com.alphamail.api.erp.domain.entity.Quote;

public interface QuoteStore {

    Quote save(Quote quote);
}
