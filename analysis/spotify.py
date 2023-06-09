import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy import SpotifyClientCredentials
import pandas as pd
import requests


scope="user-library-read,playlist-modify-public,playlist-modify-private"

client_id = '427ea87c788e4dbc9c18c105795764a8'
client_secret = 'c5ceba11570e452ba4005d3d791c4b0f'
redirect_uri = 'http://localhost:5000/'

def get_token():
    url = 'https://accounts.spotify.com/api/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    body = {'grant_type':'client_credentials','client_id':client_id,'client_secret':client_secret}
    r = requests.post(url, headers=headers, data=body)
    token = r.json()['access_token']
    return token



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

# returns a list of genres from the artist that performed the song
def get_genre_from_song_artist(sp,song_id):
    # from the song id, get the genre from the artist that performed the song
    artist_id = sp.track(song_id)['artists'][0]['id']
    artist = sp.artist(artist_id)
    return artist['genres']


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
    df = pd.DataFrame(features,index=song_names)
    return df

def get_track(sp,id):
    sp=oauth()
    track=sp.track(id)
    return track


def main():
    sp=oauth()
    playlists = {"nico":"37i9dQZF1DX9gPDOAK0Yqv", "gonza":"42RzknAZ7lkhLhl057N86v", "flori":"37i9dQZF1DXbITWG1ZJKYt"}
    features_final = []
    song_names_final = []
    for user, playlist in playlists.items():
        ids, song_names = get_tracks_from_playlist(sp,playlist,20)
        # genres = []
        # for id in ids:
        #     genres.append(get_genre_from_song_artist(sp,id))
        # print(genres)
        features = get_features(sp,ids)
        desired_features = ['danceability', 'energy', 'loudness', 'valence', 'tempo', 'acousticness']
        features = get_desired_features(features,desired_features)
        features['user'] = [user]*20
        features_final.append(features)
        song_names_final.append(song_names)
    
    df_gonza = dataframe(song_names_final[1],features_final[1])
    df_nico = dataframe(song_names_final[0],features_final[0])
    df_flori = dataframe(song_names_final[2],features_final[2])
    df = pd.concat([df_gonza,df_nico,df_flori])
    print(df)
    # save as csv
    df.to_csv('data4.csv')


if __name__ == '__main__':
    main()