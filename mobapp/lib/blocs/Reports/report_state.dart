part of 'report_bloc.dart';

@immutable
sealed class ReportState {}

final class ReportInitial extends ReportState {}

final class ReportsLoading extends ReportState {}

final class ReportsLoaded extends ReportState {
  final List<ReportModel> reports;

  ReportsLoaded({required this.reports});
}

final class ReportsError extends ReportState {
  final String message;

  ReportsError({required this.message});
}
