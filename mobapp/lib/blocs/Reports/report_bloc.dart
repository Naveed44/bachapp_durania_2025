import 'package:bloc/bloc.dart';
import 'package:meta/meta.dart';

import '../../models/ReportModel.dart';

part 'report_event.dart';
part 'report_state.dart';

class ReportBloc extends Bloc<ReportEvent, ReportState> {
  ReportBloc() : super(ReportInitial()) {
    on<GetReports>((event, emit) async {
      // add a time delay
      await Future.delayed(const Duration(seconds: 5))
          .then((value) => emit(ReportsLoaded(reports: const []))
      );
    });
  }
}
