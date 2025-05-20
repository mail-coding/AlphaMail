import { QuoteDetail, QuoteProduct } from '@/features/work/types/quote';
import {
  Page, Text, View, Document, StyleSheet, Font, PDFDownloadLink
} from '@react-pdf/renderer';
import React from 'react';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';

// 폰트 등록
Font.register({
  family: 'NanumGothic',
  src: '/fonts/NanumGothic.ttf',
});

// 스타일
const styles = StyleSheet.create({
  page: {
    fontFamily: 'NanumGothic',
    fontSize: 10,
    padding: 30,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  quoteNo: {
    textAlign: 'right',
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  supplierBox: {
    border: '1pt solid black',
    padding: 5,
    width: '45%',
  },
  quoteInfoBox: {
    width: '45%',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottom: '1pt solid #ccc',
    paddingVertical: 2,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderTop: '1pt solid black',
    borderBottom: '1pt solid black',
    fontWeight: 'bold',
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #eee',
    paddingVertical: 2,
  },
  cell: {
    width: '12.5%',
    textAlign: 'center',
  }
});

// 안전하게 문자열 변환
const safeText = (value: any): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
};

// 안전하게 숫자 변환
const safeNumber = (value: any): number => {
  return typeof value === 'number' && !isNaN(value) ? value : 0;
};

const MyPDFDocument = React.memo(({ data }: { data: QuoteDetail }) => {
  if (!data || !Array.isArray(data.products) || data.products.length === 0) return null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>견 적 서</Text>
        <Text style={styles.quoteNo}>NO. {safeText(data.quoteNo)}</Text>

        <View style={styles.topContainer}>
          <View style={styles.quoteInfoBox}>
            <Text style={{ marginBottom: 5 }}>
              견적일: {new Date(data.createdAt).toLocaleDateString()}
            </Text>
            <Text style={{ marginBottom: 10 }}>{safeText(data.manager)} 귀하</Text>
            <Text style={{ marginBottom: 3 }}>아래와 같이 견적합니다.</Text>
          </View>

          <View style={[styles.section, styles.supplierBox]}>
            {[
              ['등록번호', data.licenseNumber],
              ['상호명', data.clientName],
              ['대표자', data.representative],
              ['주소', data.shippingAddress],
              ['업태', data.businessType],
              ['종목', data.businessItem],
              ['연락처', data.managerNumber],
              ['팩스번호', ''],
            ].map(([label, value], idx) => (
              <View style={styles.row} key={idx}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{safeText(value)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold' }}>견적금액: (영 원정)</Text>
        </View>

        {/* 제품 테이블 */}
        <View style={styles.tableHeader}>
          {['NO', '품명', '규격', '수량', '단가', '공급가액', '세액', '비고'].map((col, idx) => (
            <Text key={idx} style={styles.cell}>{col}</Text>
          ))}
        </View>
        {data.products.map((item: QuoteProduct, idx: number) => {
          const price = safeNumber(item.price);
          const count = safeNumber(item.count);
          const amount = price * count;
          const tax = amount * 0.1;

          return (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.cell}>{idx + 1}</Text>
              <Text style={styles.cell}>{safeText(item.name)}</Text>
              <Text style={styles.cell}>{safeText(item.standard)}</Text>
              <Text style={styles.cell}>{count}</Text>
              <Text style={styles.cell}>{price.toLocaleString()}</Text>
              <Text style={styles.cell}>{amount.toLocaleString()}</Text>
              <Text style={styles.cell}>{tax.toLocaleString()}</Text>
              <Text style={styles.cell}>{''}</Text>
            </View>
          );
        })}
      </Page>
    </Document>
  );
});

interface PdfButtonProps {
  quoteDetail: QuoteDetail;
}

export const PdfButton: React.FC<PdfButtonProps> = ({ quoteDetail }) => {
  const isValid =
    quoteDetail &&
    typeof quoteDetail.quoteNo === 'string' &&
    Array.isArray(quoteDetail.products) &&
    quoteDetail.products.length > 0;

  if (!isValid) return null;

  return (
    <PDFDownloadLink
      document={<MyPDFDocument data={quoteDetail} />}
      fileName={`${quoteDetail.quoteNo}_견적서.pdf`}
      className="inline-block"
    >
      {({ loading, error }) => {
        if (error) {
          console.error('PDF generation error:', error);
          return (
            <Button variant="text" size="small" disabled>
              <Typography variant="titleSmall">오류 발생</Typography>
            </Button>
          );
        }

        return (
          <Button
            variant="text"
            size="small"
            className="min-w-[110px] h-[40px] border border-gray-300 bg-white shadow-none text-black font-normal hover:bg-gray-100 hover:text-black active:bg-gray-200 !rounded-none"
            disabled={loading}
          >
            <Typography variant="titleSmall">문서</Typography>
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};
