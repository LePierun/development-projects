import { StyleSheet } from 'react-native';
import React from 'react';

import Transaction from './infoData/Transactions';
import HorizontalDivider from './HorizontalSplit';

export default function HistoryList({
  payments,
  ownerId,
}) {

  return payments
    .filter(
      (item) =>
        item.U_ID_Creditor !==
        item.U_ID_Borrower
    )
    .map((item, index, filteredPayments) => {

    return (

        <Transaction
          key={item.T_ID_Transaction}
          title={item.T_Description}
          date={item.T_Date_created}
          fromName={item.CreditorName}
          toName={item.BorrowerName}
          amount={item.T_Amount}
          transId={item.T_ID_Transaction}
          ownerId={ownerId}
          creditorId={item.U_ID_Creditor}
          borrowerId={item.U_ID_Borrower}
          isLast={index === filteredPayments.length - 1}
        />

    );
  });
}

const styles = StyleSheet.create({});