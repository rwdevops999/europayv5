select * from "History";

select * from "Service";
select * from "ServiceAction";

select * from "Template";

select * from "Country";

select * from "User";
select * from "Address";

select * from "Setting";

select * from "Job";

select * from "Export";

select * from "Group";

-- DELETE DATABASE
delete from "History";
ALTER SEQUENCE "History_id_seq" RESTART WITH 1;

delete from "Service";
ALTER SEQUENCE "Service_id_seq" RESTART WITH 1;

delete from "ServiceAction";
ALTER SEQUENCE "ServiceAction_id_seq" RESTART WITH 1;

delete from "Template";
ALTER SEQUENCE "Template_id_seq" RESTART WITH 1;

delete from "Address";
ALTER SEQUENCE "Address_id_seq" RESTART WITH 1;

delete from "Country";
ALTER SEQUENCE "Country_id_seq" RESTART WITH 1;

delete from "Setting";
ALTER SEQUENCE "Setting_id_seq" RESTART WITH 1;

delete from "Job";
ALTER SEQUENCE "Job_id_seq" RESTART WITH 1;

delete from "Group";
ALTER SEQUENCE "Group_id_seq" RESTART WITH 1;
