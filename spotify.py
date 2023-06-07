import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy import SpotifyClientCredentials
import pandas

scope="user-library-read,playlist-modify-public,playlist-modify-private"

client_id = '427ea87c788e4dbc9c18c105795764a8'
client_secret = 'c5ceba11570e452ba4005d3d791c4b0f'
redirect_uri = 'http://localhost:8501/'


def oauth():
    client_credentials_manager = SpotifyOAuth(client_id=client_id, client_secret=client_secret,scope=scope, redirect_uri=redirect_uri)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    return sp

def get_tracks_from_playlist(sp,playlist_id,amount):
    ids=[]
    song_names=[]
    results = sp.playlist(playlist_id)
    # print(results['tracks']['items'])
    if amount <= len(results['tracks']['items']):
        for i in range(amount):
            ids.append(results['tracks']['items'][i]['track']['uri'].split(':')[2])
            song_names.append(results['tracks']['items'][i]['track']['name'])
        return ids,song_names
    else:
        raise Exception("Amount of songs is bigger than the amount of songs in the playlist")
    
def get_features(sp,spotify_songs_ids):
    ids_dict_features = {'danceability': [], 'energy': [], 'key': [], 'loudness': [], 'mode': [], 'speechiness': [], 'acousticness': [], 'instrumentalness': [], 'liveness': [], 'valence': [], 'tempo': []}
    for id in spotify_songs_ids:
        features = sp.audio_features(id)
        for key in ids_dict_features:
            try:
                ids_dict_features[key].append(features[0][key])
            except:
                pass
    return ids_dict_features

def get_desired_features(features,desired_features):
    new_features={}
    for feature in desired_features:
        new_features[feature]=features[feature]
    return new_features

# make a data frame. the rows are the songs, the columns are the features

def dataframe(song_names,features):
    df = pandas.DataFrame(features,index=song_names)
    return df

def get_track(sp,id):
    sp=oauth()
    track=sp.track(id)
    return track


def main():
    sp=oauth()
    ids, song_names = get_tracks_from_playlist(sp,"24bxcpSTAvKvjTgaSHpVg3",9)
    features = get_features(sp,ids)
    desired_features = ['danceability', 'energy', 'loudness', 'valence', 'instrumentalness']
    features = get_desired_features(features,desired_features)
    track_genre = get_track(sp,ids[1])['artists']
    # print(song_names)
    # print(track_genre)
    print(features)
    df = dataframe(song_names,features)
    print(df.describe())
    # save as csv
    df.to_csv('data.csv')
    


if __name__ == '__main__':
    main()