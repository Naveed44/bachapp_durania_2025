part of 'report_bloc.dart';

@immutable
sealed class ReportEvent {}

class GetReports extends ReportEvent {}