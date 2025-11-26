import 'package:flutter/widgets.dart';

import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class SqliteHandler {
    Database? database;
    String? filename;
    List<String>? initSettings;

    SqliteHandler(String? filenameP, List<String>? initSettingsP) {
        filename = filenameP;
        initSettings = initSettingsP;
    }

    Future initDatabase() async {
        String dbPath = await getDatabasesPath();
        print(dbPath);
        WidgetsFlutterBinding.ensureInitialized();
        database = await openDatabase(
            filename == null ? join(dbPath, 'DIAPotholeReporter1_settings.db') : join(dbPath, filename),
            version: 1,
            onCreate: (db, version) {
                db.execute('''
                  CREATE TABLE settings (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    key TEXT,
                    value TEXT
                  )
                ''');
            },
        );

        await _initSettings();
    }

    Future _initSettings() async {
        if (initSettings == null){
            database!.execute('''
              INSERT INTO
                settings
              (key, value)
              VALUES
              ('offline_mode', 'false');
            ''');
        }
    }
}
