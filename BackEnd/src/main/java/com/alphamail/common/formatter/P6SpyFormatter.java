package com.alphamail.common.formatter;

import java.util.Locale;

import org.hibernate.engine.jdbc.internal.FormatStyle;

import com.p6spy.engine.logging.Category;
import com.p6spy.engine.spy.appender.MessageFormattingStrategy;

/**
 * P6Spy : 쿼리문 출력 결과 확인하는 라이브러리
 * 이 클래스는 쿼리문 가독성을 위한 들여쓰기 및 줄바꿈을 처리합니다.
 */
public class P6SpyFormatter implements MessageFormattingStrategy {

	@Override
	public String formatMessage(int connectionId, String now, long elapsed, String category, String prepared,
		String sql, String url) {
		sql = formatSql(category, sql);
		return String.format("[%s] | %d ms | %s", category, elapsed, formatSql(category, sql));
	}

	private String formatSql(String category, String sql) {
		if (sql != null && !sql.trim().isEmpty() && Category.STATEMENT.getName().equals(category)) {
			String trimmedSql = sql.trim().toLowerCase(Locale.ROOT);
			if (trimmedSql.startsWith("create") || trimmedSql.startsWith("alter") || trimmedSql.startsWith("comment")) {
				return FormatStyle.DDL.getFormatter().format(sql);
			}
			return FormatStyle.BASIC.getFormatter().format(sql);
		}
		return sql;
	}
}