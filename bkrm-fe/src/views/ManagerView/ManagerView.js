import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import History from "./History/History";
import Branch from "./Branch/Branch";

import GeneralSetting from "./Setting/GeneralSetting/GeneralSetting";
import DiscountSetting from "./Setting/DiscountSetting/DiscountSetting";
import VoucherSetting from "./Setting/VoucherSetting/VoucherSetting";
import WebSetting from "./Setting/WebSetting/WebSetting";
import EmailSetting from "./Setting/EmailSetting/EmailSetting"
import Customer from "./Customer/Customer";
import Report from "./Report/Report";
import { useSelector } from "react-redux";
import AbousUsSetting from "./Setting/WebSetting/AbousUsSetting";
import EndDateStatistics from "./Statistics/EndDateStatistics/EndDateStatistics";
import ProductStatistics from "./Statistics/ProductStatistics/ProductStatistics"
import CustomerStatistics from "./Statistics/CustomerStatistics/CustomerStatistics"
import EmployeeStatistics from "./Statistics/EmployeeStatistic/EmployeeStatistics"
import SupplierStatistics from "./Statistics/SupplierStatistics/SupplierStatistics"
import GeneralStatistics from "./Statistics/GeneralStatistics/GeneralStatistics"
import IncomeStatistics from "./Statistics/IncomeStatistics/IncomeStatistics"
import BranchStatistics from "./Statistics/BranchStatistics/BranchStatistics"
import CashBook from "./Statistics/CashBook/CashBook";
import FinancialReport from "./Statistics/FinancialReport/FinancialReport"
import Metabase from "./Statistics/Metabase/Metabase";
const ManagerView = (props) => {
  
  const { path } = useRouteMatch();
  const permissions = useSelector((state) => state.info.user.permissions);
  return (
    <Switch>
      <Route exact path={path} component={History}>
        <Redirect
          to={
            permissions?.find((p) => p.name === "report")
              ? `${path}/history`
              : "/home"
          }
        />
      </Route>
      <Route exact path={`${path}/history`} component={History} />
      <Route path={`${path}/branch`} component={Branch} />

      <Route path={`${path}/customer`} component={Customer} />
      <Route path={`${path}/report`} component={Report} />

      <Route path={`${path}/general-report`} component={GeneralStatistics} />
      <Route path={`${path}/cashbook`} component={CashBook} />
      <Route path={`${path}/income-report`} component={IncomeStatistics} />
      <Route path={`${path}/product-report`} component={ProductStatistics} />
      <Route path={`${path}/customer-report`} component={CustomerStatistics} />
      <Route path={`${path}/employee-report`} component={EmployeeStatistics} />
      <Route path={`${path}/supplier-report`} component={SupplierStatistics} />
      <Route path={`${path}/branch-report`} component={BranchStatistics} />
      <Route path={`${path}/financial-report`} component={FinancialReport} />
      <Route path={`${path}/metabase`} component={Metabase} />

      <Route path={`${path}/end-date-report`} component={EndDateStatistics} />

      {/* <Route path={`${path}/report-date`} component={GeneralSetting} /> */}

      <Route path={`${path}/setting`} component={GeneralSetting} />
      <Route path={`${path}/setting-discount`} component={DiscountSetting} />
      <Route path={`${path}/setting-voucher`} component={VoucherSetting} />
      <Route path={`${path}/setting-web`} component={WebSetting} />
      <Route path={`${path}/setting-email`} component={EmailSetting} />
      <Route path={`${path}/aboutus-setting`} component={AbousUsSetting} />
    </Switch>
  );
};

export default ManagerView;
