import QueryForm from './QueryForm';
import BaseTable from "./BaseTable";
export default {
    install(app: any) {
        app.use(BaseTable);
        app.use(QueryForm);
    }
}
